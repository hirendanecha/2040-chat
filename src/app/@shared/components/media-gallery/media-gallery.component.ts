import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import * as moment from 'moment';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { MessageDatePipe } from '../../pipe/message-date.pipe';
@Component({
  selector: 'app-media-gallery',
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.scss'],
})
export class MediaGalleryComponent implements OnInit {
  @Input('userChat') userChat: any = {};
  mediaList: any = [];
  fileName: string;
  profileId: number;
  activePage = 1;
  hasMoreData = false;
  filterMediaList = [];
  constructor(
    private messageService: MessageService,
    public activeOffCanvas: NgbActiveOffcanvas
  ) {
    this.profileId = +localStorage.getItem('profileId');
  }

  ngOnInit() {
    this.getMessageMedia();
  }

  getMessageMedia(): void {
    const data = {
      roomId: this.userChat?.roomId || null,
      groupId: this.userChat?.groupId || null,
      size: 10,
      page: this.activePage,
    };
    this.messageService.getMessageMedia(data).subscribe({
      next: (res: any) => {
        if (this.activePage < res?.pagination.totalPages) {
          this.hasMoreData = true;
        } else {
          this.hasMoreData = false;
        }
        this.mediaList = [...this.mediaList, ...res.data];
        this.filterMediaList = new MessageDatePipe().transform(this.mediaList);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  isFile(media: string): boolean {
    this.fileName = media?.split('/')[3]?.replaceAll('%', '-');
    const FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip'];
    return FILE_EXTENSIONS.some((ext) => media?.endsWith(ext));
  }

  pdfView(pdfUrl: string) {
    window.open(pdfUrl);
  }

  loadMoreMedia() {
    this.activePage = this.activePage + 1;
    this.getMessageMedia();
  }

  downloadPdf(data): void {
    const pdfLink = document.createElement('a');
    pdfLink.href = data;
    pdfLink.click();
  }
}
